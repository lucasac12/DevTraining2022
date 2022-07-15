using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjDevTraining.Models
{
    public class ProfissionalModel
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(300)]
        public string NomeCompleto { get; set; }

        [MaxLength(11)]
        public string CPF { get; set; }
        public DateTime DataNascimento { get; set; }

        [MaxLength(1)]
        public string Sexo { get; set; }

        public Boolean Ativo { get; set; }

        public int NumeroRegistro { get; set; }

        [MaxLength(8)]
        public string? CEP { get; set; }

        [MaxLength(300)]
        public string? Cidade { get; set; }

        public float? ValorRenda { get; set; }

        public DateTime DataCriacao { get; set; }


    }
}
