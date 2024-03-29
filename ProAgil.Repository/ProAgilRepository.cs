using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        private readonly ProAgilContext _context;

        public ProAgilRepository(ProAgilContext context)
        {
            _context = context;
            //fazendo o no tracking de forma genérica
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }


#region Genericos

        public void Add<T>(T entity) where T : class
        {
            _context.Add (entity);
        }

        public void Update<T>(T entity) where T : class
        {
            _context.Update (entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove (entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }


#endregion



#region Eventos

        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                    .Include(c => c.Lotes)
                    .Include(c => c.RedesSociais);

            if (includePalestrantes)
            {
                query = query
                        .Include(pe => pe.PalestrantesEventos)
                        .ThenInclude(p => p.Palestrantes);
            }
                //não bloqueando de forma especifica diretamente no método
            query = query.AsNoTracking()
                         .OrderBy(c => c.Id);

            return await query.ToArrayAsync();
        }

        public async Task<Evento> GetAllEventoAsyncById(int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                    .Include(c => c.Lotes)
                    .Include(c => c.RedesSociais);

            if (includePalestrantes)
            {
                query = query
                        .Include(pe => pe.PalestrantesEventos)
                        .ThenInclude(p => p.Palestrantes);
            }

            query = query
                    .OrderByDescending(c => c.DataEvento)
                    .Where(c => c.Id == eventoId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = _context.Eventos
                    .Include(c => c.Lotes)
                    .Include(c => c.RedesSociais);

            if (includePalestrantes)
            {
                query = query
                        .Include(pe => pe.PalestrantesEventos)
                        .ThenInclude(p => p.Palestrantes);
            }

            query = query
                    .OrderByDescending(c => c.DataEvento)
                    .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }

#endregion



#region Palestrante

        public async Task<Palestrante> GetAllPalestranteAsyncById(int palestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                            .Include(c => c.RedesSociais);

            if (includeEventos)
            {
                query = query
                        .Include(pe => pe.PalestrantesEventos)
                        .ThenInclude(e => e.Eventos);
            }

            query = query.OrderBy(p => p.Nome)
                    .Where(p => p.Id == palestranteId);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetAllPalestranteAsyncByName(string name, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                            .Include(c => c.RedesSociais);

            if (includeEventos)
            {
                query = query
                        .Include(pe => pe.PalestrantesEventos)
                        .ThenInclude(e => e.Eventos);
            }

            query = query.OrderBy(p => p.Nome)
                    .Where(p => p.Nome.ToLower().Contains(name.ToLower()));

            return await query.ToArrayAsync();
        }


#endregion
    }
}
