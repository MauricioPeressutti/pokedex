// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const METHOD = req.method
  if (METHOD === "GET") {
    const pokemons = await prisma.pokemon.findMany({
      orderBy: [
        {
          order: "asc",
        },
      ],
    })
    return res.status(200).json({ ok: true, data: pokemons })
  }

  if (METHOD === "POST") {
    return await createPokemon(req, res)
  }
}

async function createPokemon(req, res) {
  const { name } = JSON.parse(req.body)

  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(403).json({
      ok: false,
      message: "Para atrapar un pokemón primero debes iniciar sesión",
    })
  }

  try {
    const foundPokemon = await prisma.pokemon.findFirst({
      where: {
        name,
      },
    })
    if (!foundPokemon) {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
      )
      if (response.ok) {
        const pokemon = await response.json()

        const newPokemon = await prisma.pokemon.create({
          data: {
            name: pokemon.name,
            order: pokemon.order,
            imageUrl: pokemon.sprites.front_default,
            userEmail: session.user.email,
            userImageUrl: session.user.image,
          },
        })
        return res.status(201).json({
          ok: true,
          data: newPokemon,
          message: `Atrapaste con éxito a ${name} 🥳`,
        })
      } else {
        return res.status(400).json({
          ok: false,
          message: `No existe ningún pokemón de nombre ${name} 🤔`,
        })
      }
    } else {
      res
        .status(400)
        .json({ ok: false, message: `${name} ya ha sido atrapado! 😵‍💫` })
    }
  } catch (error) {
    console.error("Request error", error)
    res.status(500).json({ error: "Error creating question", success: false })
  }
}
