// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  console.log({ body: req.body })
  const { num1, num2 } = JSON.parse(req.body)
  console.log({ num1, num2 })
  return num1 + num2
}
