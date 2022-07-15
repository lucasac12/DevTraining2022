using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjDevTraining.Data;
using ProjDevTraining.Models;
using System.Data.Entity;

namespace ProjDevTraining.Controllers
{
    public class ProfissionalController : Controller
    {
        private readonly Context _context;

        public ProfissionalController(Context context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }

        public List<ProfissionalModel> BuscaComFiltro(String nomeCompleto, Boolean ativo, int rangeMenor = 0, int rangeMaior = 0)
        {
            try
            {
                var listaProfissionais = new List<ProfissionalModel>();
                var retorno = new List<ProfissionalModel>();
                var validador = 0;
                listaProfissionais = _context.Profissional.OrderBy(Profissional => Profissional.NomeCompleto).ToList();

                foreach (var p in listaProfissionais)
                {
                    validador = 0;

                    if(nomeCompleto != null)
                    {
                        if (!p.NomeCompleto.Contains(nomeCompleto))
                        {
                            validador = 1;
                        }
                    }

                    if(rangeMenor > 0 && rangeMaior > 0)
                    {
                        if (p.NumeroRegistro < rangeMenor || p.NumeroRegistro > rangeMaior)
                        {
                            validador = 1;
                        }
                    }

                    if(ativo)
                    {
                        if (!p.Ativo)
                        {
                            validador = 1;
                        }
                    }

                    if (validador == 0)
                    {
                        retorno.Add(p);
                    }
                }

                return retorno;
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

        }

        private bool ProfissionalModelExists(int id)
        {
            return _context.Profissional.Any(e => e.Id == id);
        }

        public String SalvarProfissional(ProfissionalModel profissionalModel)
        {
            //Verificar se já existe o registro no banco
            if (ProfissionalModelExists(profissionalModel.Id))
            {
                //Editar
                try
                {
                    if(VerificaSeExisteProfissionalComOMesmoNome(profissionalModel))
                    {
                        ProfissionalModel profissionalExistente = _context.Profissional.Where(x => x.Id == profissionalModel.Id).FirstOrDefault();
                        if(profissionalExistente != null)
                        {
                            profissionalExistente.NomeCompleto = profissionalModel.NomeCompleto;
                            profissionalExistente.CPF = profissionalModel.CPF;
                            profissionalExistente.DataNascimento = profissionalModel.DataNascimento;
                            profissionalExistente.Sexo = profissionalModel.Sexo;
                            profissionalExistente.CEP = profissionalModel.CEP;
                            profissionalExistente.Cidade = profissionalModel.Cidade;
                            profissionalExistente.ValorRenda = profissionalModel.ValorRenda;
                        }
                        _context.Update(profissionalExistente);
                        _context.SaveChanges();
                        return "Profissional Editado com Sucesso!";
                    } else
                    {
                        return "Já existe um registro com o mesmo nome!";
                    }

                }
                catch (DbUpdateConcurrencyException)
                {
                    throw;
                }
            }
            else
            {
                //Novo Cadastro 
                try
                {
                    if (VerificaSeExisteProfissionalComOMesmoNome(profissionalModel))
                    {
                        var listaProfissionais = new ProfissionalModel();
                        listaProfissionais = _context.Profissional.OrderByDescending(Profissional => Profissional.NumeroRegistro).FirstOrDefault();
                        profissionalModel.NumeroRegistro = listaProfissionais.NumeroRegistro + 1;
                        profissionalModel.DataCriacao = DateTime.Now;
                        _context.Add(profissionalModel);
                        _context.SaveChanges();
                        return "Profissional Cadastrado com Sucesso!";
                    }
                    else
                    {
                        return "Já existe um registro com o mesmo nome!";
                    }
                }
                catch (DbUpdateConcurrencyException)
                {
                    throw;
                }

            }
        }

        public bool VerificaSeExisteProfissionalComOMesmoNome(ProfissionalModel profissionalModel)
        {
            var listaProfissionais = new List<ProfissionalModel>();
            listaProfissionais = _context.Profissional.OrderBy(Profissional => Profissional.NomeCompleto).ToList();

            foreach (var p in listaProfissionais)
            {
                if ((p.NomeCompleto == profissionalModel.NomeCompleto) && (p.Id != profissionalModel.Id))
                {
                    return false;
                }
            }

            return true;
                
        }

        public ProfissionalModel BuscarRegistroDeProfissional(int codigo)
        {
            ProfissionalModel profissionalModel = new ProfissionalModel();

            try
            {
                if (ProfissionalModelExists(codigo))
                {
                    profissionalModel = _context.Profissional.FirstOrDefault(m => m.Id == codigo);
                }

                return profissionalModel;
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

        }

        public bool ExcluirRegistroDeProfissional(int codigo)
        {
            try
            {
                if (ProfissionalModelExists(codigo))
                {
                    var profissionalModel = _context.Profissional.Find(codigo);
                    _context.Profissional.Remove(profissionalModel);
                    _context.SaveChanges();
                }

                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }
    }
}
