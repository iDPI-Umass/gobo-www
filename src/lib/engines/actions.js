import { Gobo } from "$lib/engines/account.js";


const Actions = {};

Actions.resendEmailVerification = async () => {
  const client = await Gobo.get();
  await client.actionResendEmailVerification.post({
    parameters: { person_id: client.id },
  });
};


export {
  Actions
}