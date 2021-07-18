using System.Threading.Tasks;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
        #region Generico
         void Add<T>(T entity) where T:class;
         void Update<T>(T entity) where T:class;
         void Delete<T>(T entity) where T:class;
         Task<bool> SaveChangesAsync();

         #endregion

         #region Evento
         Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes = false);
         Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false);
         Task<Evento> GetAllEventoAsyncById(int eventoId, bool includePalestrantes = false);

         #endregion

         #region Palestrantes
         Task<Palestrante[]> GetAllPalestranteAsyncByName(string name, bool includeEventos = false);
         Task<Palestrante> GetAllPalestranteAsyncById(int palestranteId, bool includeEventos = false);
         #endregion
    }
}