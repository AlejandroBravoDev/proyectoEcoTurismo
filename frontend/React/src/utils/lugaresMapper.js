export function mapLugar(lugar) {
  const comentarios = lugar.comentarios || [];

  const suma = comentarios.reduce(
    (acc, c) => acc + (parseFloat(c.rating) || 0),
    0
  );

  const promedio =
    comentarios.length > 0 ? suma / comentarios.length : 0;

  const category =
    comentarios.length > 0
      ? comentarios[0].category || "General"
      : "General";

  return {
    ...lugar,
    rating: Number(promedio.toFixed(1)),
    score: promedio,
    category,
    img: lugar.imagen_url,
  };
}
