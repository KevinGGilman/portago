export default function validateFields (req, requiredFields) {
  const emptyField = requiredFields.find((v) => req.body[v] === undefined)
  if (!req.body || emptyField) {
    throw new Error(`Missing field ${emptyField}`)
  }
}
