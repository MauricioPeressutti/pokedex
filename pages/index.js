import Head from "next/head"
import Image from "next/image"
import { useEffect, useState } from "react"
import styles from "../styles/Home.module.css"

export default function Home() {
  const [pokemonName, setPokemonName] = useState("")
  const [pokemons, setPokemons] = useState([])

  const handleChange = ({ target }) => setPokemonName(target.value)

  const catchPokemon = async () => {
    if (!pokemonName) return
    console.log({ pokemonName })
    const res = await fetch(`/api/pokemon`, {
      method: "POST",
      body: JSON.stringify({ name: pokemonName }),
      "Content-Type": "application/json",
    })

    if (res.ok) {
      const resJSON = await res.json()
      fetchPokemons()
      console.log({ resJSON })
    }
  }

  const fetchPokemons = async () => {
    const res = await fetch("/api/pokemon")

    if (res.ok) {
      const { data } = await res.json()
      setPokemons(data)
    } else {
      console.log("Hubo un error al obtener los pokemons")
    }
  }

  useEffect(() => {
    fetchPokemons()
  }, [])

  console.log({ pokemons })

  return (
    <div className={styles.container}>
      <Head>
        <title>Pokedex</title>
        <meta
          name="description"
          content="Pokedex con PlanetScale, Prisma y Next JS"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>¿Qué pokemón deseas atrapar?</h3>
        <input onChange={handleChange} />
        <button onClick={catchPokemon}>Atrapar</button>
        <div style={{ martinTop: "1.5rem" }}>
          {pokemons.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                marginTop: "1rem",
                borderRadius: "0.5rem",
                boxShadow: "0 0 10px white",
              }}
            >
              <Image src={p.imageUrl} width={200} height={200} />
              <p style={{ color: "#333", fontWeight: "bold" }}>
                {p.name.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
