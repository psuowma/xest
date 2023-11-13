const yup = require("yup");
const selectInvitationByShortCode = require("./queries/selectInvitationByShortCode");

const deleteInvitationSchema = yup.object().shape({
  userId: yup
    .number()
    .positive()
    .min(1, "This field can not be empty!")
    .label("User Id")
    .typeError("The user id must be a valid number"),

  invitationId: yup
    .number()
    .positive()
    .label("invitaionId")
    .typeError("The invitation id must be a valid id"),

  email: yup
    .string()
    .email()
    .label("email")
    .typeError("The email must be a valid email"),

  shortCode: yup
    .string()
    .min(1)
    .label("Invitation ShortCode")
    .typeError("The Invitation shortCode must be a valid string")
    .test(
      "ShortCodeMustExist",
      "The Invitation ShortCode must belong to an invitation with the same Invitation Id & the Invitation must belong to the user",
      async function test(shortCode) {
        const { invitationId, email } = this.parent;

        const invitation = await selectInvitationByShortCode({
          shortCode,
          invitationId,
          email
        });
        if (invitation) {
          return true;
        }

        return false;
      }
    )
});

module.exports = deleteInvitationSchema;
