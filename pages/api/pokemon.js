// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const METHOD = req.method
  console.log({ req })
  if (METHOD === "GET") {
    const pokemons = await prisma.pokemon.findMany({
      orderBy: [
        {
          order: "asc",
        },
      ],
    })
    console.log({ pokemons })
    return res.status(200).json({ ok: true, data: pokemons })
  }

  if (METHOD === "POST") {
    return await createPokemon(req, res)
  }
}

async function createPokemon(req, res) {
  const { name } = JSON.parse(req.body)
  try {
    const foundPokemon = await prisma.pokemon.findFirst({
      where: {
        name,
      },
    })
    console.log({ foundPokemon })
    if (!foundPokemon) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      console.log({ ok: response.ok })
      if (response.ok) {
        const pokemon = await response.json()
        console.log({ pokemon })
        const newPokemon = await prisma.pokemon.create({
          data: {
            name: pokemon.name,
            order: pokemon.order,
            imageUrl: pokemon.sprites.front_default,
          },
        })
        return res.status(201).json({ ok: true, data: newPokemon })
      } else {
        return res
          .status(400)
          .json({ ok: false, message: "Ese pokemón no existe" })
      }
    }
  } catch (error) {
    console.error("Request error", error)
    res.status(500).json({ error: "Error creating question", success: false })
  }
}
