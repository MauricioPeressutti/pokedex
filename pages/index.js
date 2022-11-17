import Head from "next/head"
import Image from "next/image"
import { useEffect, useState } from "react"
import styles from "../styles/Home.module.css"
import Swal from "sweetalert2"

export default function Home() {
  const [pokemonName, setPokemonName] = useState("")
  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState("")

  const handleChange = ({ target }) =>
    setPokemonName(target.value.toLowerCase())

  const catchPokemon = async () => {
    if (!pokemonName) return

    setLoading("catching")
    const res = await fetch(`/api/pokemon`, {
      method: "POST",
      body: JSON.stringify({ name: pokemonName }),
      "Content-Type": "application/json",
    })

    const resJSON = await res.json()
    if (res.ok) {
      Swal.fire("¡Excelente!", resJSON.message, "success")
      await fetchPokemons()
      console.log({ resJSON })
    } else {
      Swal.fire("UPS!", resJSON.message, "info")
      await fetchPokemons()
    }
  }

  const fetchPokemons = async () => {
    setLoading("fetching")
    const res = await fetch("/api/pokemon")

    if (res.ok) {
      const { data } = await res.json()
      setLoading("")
      setPokemons(data)
    } else {
      console.log("Hubo un error al obtener los pokemons")
    }
  }

  useEffect(() => {
    fetchPokemons()
  }, [])

  return (
    <>
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
          <h1 style={{ textAlign: "center" }}>
            ¿Qué pokemón deseas atrapar? 😮
          </h1>
          <span
            style={{ color: "grey", marginBottom: "1rem", marginTop: "-1rem" }}
          >
            Ya se han atrapado {pokemons?.length}
          </span>
          <input onChange={handleChange} value={pokemonName} />
          <button onClick={catchPokemon} style={{ marginBottom: "2rem" }}>
            Atrapar
          </button>

          {loading === "catching" && <p>Intentando atrapar a {pokemonName}</p>}
          {loading === "fetching" && <p>Obteniendo pokemons...</p>}
          {!loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.3rem 1rem",
                flexWrap: "wrap",
                martinTop: "2.5rem",
                width: "100%",
                maxWidth: "70rem",
              }}
            >
              {pokemons.map((p) => (
                <div
                  className="poke-card"
                  key={p.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                    marginTop: "1rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 0 5px white",
                  }}
                >
                  <b
                    style={{
                      position: "absolute",
                      left: "0.3rem",
                      top: "0.3rem",
                      fontSize: "1.3rem",
                      color: "#333",
                    }}
                  >
                    #{p.order}
                  </b>
                  <div style={{ marginTop: "2rem" }}>
                    <Image
                      src={p.imageUrl}
                      width={130}
                      height={130}
                      alt={p.name}
                    />
                  </div>
                  <p
                    style={{
                      color: "#333",
                      fontWeight: "bold",
                      margin: "0 0 1rem 0",
                    }}
                  >
                    {p.name.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <style jsx>{`
        .poke-card {
          transition: all 0.2s ease-in-out;
          position: relative;
          min-width: 10rem;
        }

        .poke-card:hover {
          cursor: pointer;
          transform: scale(1.05);
        }

        @media (max-width: 420px) {
          .poke-card {
            min-width: 80%;
          }
        }
      `}</style>
    </>
  )
}
