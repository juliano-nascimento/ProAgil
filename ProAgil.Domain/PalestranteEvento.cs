namespace ProAgil.Domain
{
    public class PalestranteEvento
    {
        public int PalestranteId { get; set; }
        public Palestrante Palestrantes { get; set; }
        public int EventoId { get; set; }
        public Evento Eventos { get; set; }
    }
}