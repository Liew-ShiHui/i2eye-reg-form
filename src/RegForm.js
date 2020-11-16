import React, { useState } from "react";
import { Formik, Form } from 'formik'
import PersonalDetails from "./Components/RegFormComponents/PersonalDetails";
import Lifestyle from "./Components/RegFormComponents/Lifestyle";
import HouseholdInfo from "./Components/RegFormComponents/HouseholdInfo";
import MedicalConditions from "./Components/RegFormComponents/MedicalConditions";
import Confirm from "./Components/RegFormComponents/Confirm";
import Success from "./Components/RegFormComponents/Success";
import {getStepValidationSchema} from "./Components/RegFormComponents/validationSchema";
import Button from "@material-ui/core/Button";
import { postRegistration } from "./dbFunctions";
import { regFormJson } from "./Components/RegFormComponents/formatJson";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Backdrop } from "@material-ui/core";

const renderStep = (
  step, 
  {values, errors, touched, handleChange, setFieldValue},
  patientId,
  errorPresent,
  ) => {
  switch (step) {
    case 0:
      return (
        <PersonalDetails
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
        />
      );
    case 1:
      return (
        <Lifestyle
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
        />
      );
    case 2:
      return (
        <HouseholdInfo
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
        />
      );
    case 3:
      return (
        <MedicalConditions
          values={values}
          errors={errors}
          touched={touched}
          handleChange={handleChange}
          setFieldValue={setFieldValue}
        />
      );
    case 4:
      return (
        <Confirm
          values={values} errorPresent={errorPresent}
        />
      );
    case 5:
      return <Success patientId={patientId}/>;
    default:
      return 0;
  }
};

export const RegForm = () => {

  const regFormData = {
    // personal details
    name: "",
    nric: "",
    gender: "",
    birthday: "",
    age: 0,
    education: "",
    occupation: "",

    // lifestyle
    exercise_freq: "",
    exercise_duration: 0,

    // household info
    monthly_household_income: 0.00,
    household_count: 0,
    
    // medical conditions
    symptoms: [],
    cough_2_weeks: false,
    cough_up_blood: false,
    breathlessness: false,
    weight_loss: false,
    loss_of_appetite: false,
    fever: false,
    no_symptom: false,

    has_tubercolosis: "",
    live_with_someone_with_tubercolosis: "",
    other_diagnosed_with_tubercolosis_beyond_4_months: "",
    
    has_blood_borne_disease: "",
    blood_borne_disease: "",
        
    family_has_diabetes: "",
    family_diabetes_count: 0,
    
    family_has_anemia: "",
    family_anemia_count: 0,
    
    family_has_oral_cancer: "",
    family_oral_cancer_count: 0,
    
    pre_existing_conditions: "",
    family_pre_existing_conditions: "",
  }

  const [step, setStep] = useState(0);
  const isSubmitStep = step === 4;
  // a snapshot of form state is used as initialValues after each transition
  const [snapshot, setSnapshot] = useState({...regFormData});
  const [isLoading, setIsLoading] = useState(false);
  const [errorPresent, setErrorPresent] = useState(false);
  let patientId = Object.create(null);  
  
  const nextStep = values => {
    setSnapshot(values);
    setStep(Math.min(step + 1, 6));
  };

  const prevStep = values => {
    setSnapshot(values);
    setStep(Math.max(step - 1, 0));
  };

  const handleSubmit = (values, formikBag) => {
    if (isSubmitStep) {
      const newUser = regFormJson(values);
      setIsLoading(true);
      //reset error state for re-submissions
      setErrorPresent(false);
     
      // ---- for testing ----
      // create test user below
      // newUser = getTestData(1).registration
      // setTimeout(() => {
      //   setIsLoading(false);
      //   // success case
      //   // params.patientID = 1;
      //   // return nextStep(values);
      //   // error case
      //   setErrorPresent(false); 
      // }, 3000)
      // ---- end of testing code ----

      postRegistration(newUser).then(res => {
        setIsLoading(false);
        // check if response is a number (ie patientId)
        if (isNaN(res)) {
          setErrorPresent(true);
        } else {
          setErrorPresent(false);
          // registration successful
          patientId = res;
          nextStep(values); 
        }
      }).catch(err => {
        setErrorPresent(true);
      });

    } else if (step === 5) {
      // reset form
      setSnapshot(snapshot => ({...regFormData}));
      formikBag.setValues({...regFormData});
      // go back to first step of form (step 0)
      setStep(0);
    } else {
      formikBag.setTouched({}); // need to check if success page needs this
      nextStep(values);
    }
  };

  return (
    <Formik
        initialValues={snapshot}
        onSubmit={handleSubmit}
        validationSchema={getStepValidationSchema(step)}
      >
        {formik => (
          <Form noValidate>
            {renderStep(step, formik, patientId, errorPresent)}
            {(step > 0 && step < 5 && !isLoading) && <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 20, marginRight: 20 }}
              onClick={() => prevStep(formik.values)}
              disabled={isLoading}
            >
              Back
            </Button>}

            {!isLoading 
          ? <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            type="submit"
            disabled={isSubmitStep && isLoading}
          >
            {isSubmitStep  
              ? "Submit" 
              : step < 5
              ? "Next"
              : "Register new patient"}
          </Button>
          : <Backdrop open={isLoading}>
              <CircularProgress />
          </Backdrop>
          }

          </Form>
        )}
      </Formik>
    );
};

export default RegForm;