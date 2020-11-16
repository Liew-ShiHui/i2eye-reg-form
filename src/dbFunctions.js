// register new patient
export const postRegistration = async (data) => {
  try {
    let response = await fetch("/submit_registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.text();
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}