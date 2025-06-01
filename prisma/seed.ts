import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const books = [
    {
      id: 1,
      title: 'O Senhor dos Anéis',
      author: 'J.R.R. Tolkien',
      price: 59.9,
      genre: 'Fantasia',
      description:
        'Uma épica jornada na Terra Média onde a pequena comunidade da Sociedade do Anel enfrenta perigos inimagináveis para destruir o Anel do Poder. Essa missão é crucial para impedir que o Senhor das Trevas, Sauron, domine o mundo com sua tirania e escuridão.',
    },
    {
      id: 2,
      title: 'Harry Potter e o Prisioneiro de Azkaban',
      author: 'J.K. Rowling',
      price: 69.9,
      genre: 'Fantasia',
      description:
        'Harry Potter retorna para seu terceiro ano em Hogwarts enfrentando o misterioso e perigoso fugitivo Sirius Black. Entre novas descobertas e desafios, ele descobre segredos importantes sobre seu passado e o verdadeiro significado da amizade e coragem.',
    },
    {
      id: 3,
      title: 'Cidade dos Ossos',
      author: 'Cassandra Clare',
      price: 54.9,
      genre: 'Fantasia',
      description:
        'Clary Fray é lançada em um mundo oculto de Caçadores de Sombras, seres que lutam contra demônios. Ao descobrir sua verdadeira identidade, ela enfrenta perigos sobrenaturais e segredos familiares que mudarão sua vida para sempre.',
    },
    {
      id: 4,
      title: 'Verity',
      author: 'Colleen Hoover',
      price: 49.9,
      genre: 'Suspense',
      description:
        'Uma escritora aceita terminar o manuscrito da autora Verity Crawford, mas ao investigar seus papéis pessoais, descobre segredos sombrios e perturbadores que colocam em dúvida a verdade sobre sua vida e suas intenções.',
    },
    {
      id: 5,
      title: 'Garota Exemplar',
      author: 'Gillian Flynn',
      price: 46.9,
      genre: 'Suspense',
      description:
        'Quando Amy desaparece no dia do seu aniversário de casamento, todas as suspeitas recaem sobre seu marido Nick. A trama revela reviravoltas inesperadas e mostra as camadas ocultas de um relacionamento tóxico e cheio de manipulações.',
    },
    {
      id: 6,
      title: 'A Empregada',
      author: 'Freida McFadden',
      price: 59.9,
      genre: 'Suspense',
      description:
        'Ao aceitar um emprego como empregada doméstica em uma mansão, a protagonista descobre que a família esconde segredos sombrios. Aos poucos, ela é envolvida em uma trama de suspense e mistério, onde nada é o que parece.',
    },
    {
      id: 7,
      title: 'O Silêncio dos Inocentes',
      author: 'Thomas Harris',
      price: 52.9,
      genre: 'Suspense',
      description:
        'Clarice Starling, jovem agente do FBI, busca a ajuda do brilhante mas perturbado Dr. Hannibal Lecter para capturar um serial killer. A história explora os limites entre sanidade e loucura, enquanto Clarice enfrenta seus próprios demônios.',
    },
    {
      id: 8,
      title: '1984',
      author: 'George Orwell',
      price: 52.5,
      genre: 'Ficção distópica',
      description:
        'Em um futuro sombrio e totalitário, o protagonista Winston Smith luta para preservar sua individualidade em uma sociedade controlada pelo Grande Irmão. O livro é uma crítica poderosa à vigilância, repressão e manipulação da verdade.',
    },
    {
      id: 9,
      title: 'É Assim que Acaba',
      author: 'Colleen Hoover',
      price: 42.9,
      genre: 'Drama',
      description:
        'Lily enfrenta um relacionamento complicado e abusivo enquanto tenta construir uma nova vida. A narrativa aborda temas delicados como amor, violência doméstica e superação, trazendo uma mensagem de esperança e coragem.',
    },
    {
      id: 10,
      title: 'Normal People',
      author: 'Sally Rooney',
      price: 38.5,
      genre: 'Drama',
      description:
        'Acompanhe a complexa relação entre Marianne e Connell, desde o ensino médio até a universidade. A obra explora sentimentos intensos, vulnerabilidades e os desafios do amor em meio a inseguranças pessoais.',
    },
    {
      id: 11,
      title: 'O Pequeno Príncipe',
      author: 'Antoine de Saint-Exupéry',
      price: 29.9,
      genre: 'Fábula / Fantasia',
      description:
        'Um pequeno príncipe viaja por planetas diferentes, descobrindo lições profundas sobre amor, amizade e a essência da vida. A fábula encantadora toca corações de todas as idades com sua simplicidade e sabedoria.',
    },
    {
      id: 12,
      title: 'Les Misérables',
      author: 'Victor Hugo',
      price: 58.0,
      genre: 'Drama',
      description:
        'Um épico da literatura que narra a vida de Jean Valjean, um ex-prisioneiro em busca de redenção na França do século XIX, enfrentando injustiças sociais, amor e luta pela liberdade.',
    },
    {
      id: 13,
      title: 'Orgulho e Preconceito',
      author: 'Jane Austen',
      price: 45.9,
      genre: 'Romance',
      description:
        'A história de Elizabeth Bennet e Mr. Darcy revela as complexidades do amor, classe social e julgamentos precipitados na Inglaterra do século XIX, marcada por diálogos afiados e personagens inesquecíveis.',
    },
    {
      id: 14,
      title: 'A Culpa é das Estrelas',
      author: 'John Green',
      price: 39.9,
      genre: 'Drama',
      description:
        'Hazel e Gus, dois jovens com câncer, encontram no amor e na amizade forças para enfrentar suas limitações e descobrir a beleza da vida mesmo em meio à dor e à incerteza.',
    },
    {
      id: 15,
      title: 'Holly',
      author: 'Stephen King',
      price: 44.9,
      genre: 'Suspense',
      description:
        'Holly Gibney é uma investigadora particular que enfrenta casos complexos e ameaças perigosas, mostrando coragem e inteligência em meio a situações de suspense e mistério.',
    },
    {
      id: 16,
      title: 'Talvez Você Deva Conversar com Alguém',
      author: 'Lori Gottlieb',
      price: 34.9,
      genre: 'Autoajuda',
      description:
        'Uma terapeuta relata suas próprias sessões e desafios pessoais, revelando a importância do autoconhecimento e da terapia para o crescimento emocional e a superação de crises.',
    },
    {
      id: 17,
      title: 'A Sutil Arte de Ligar o F*da-se',
      author: 'Mark Manson',
      price: 36.0,
      genre: 'Autoajuda',
      description:
        'Um guia direto e irreverente que ensina como focar no que realmente importa na vida, aceitando limitações e escolhas para alcançar uma existência mais significativa e feliz.',
    },
    {
      id: 18,
      title: 'As Coisas que Você Só Vê Quando Desacelera',
      author: 'Haemin Sunim',
      price: 32.0,
      genre: 'Autoajuda',
      description:
        'Reflexões e ensinamentos para desacelerar o ritmo da vida, encontrar paz interior e cultivar a felicidade em meio às pressões e desafios do cotidiano moderno.',
    },
  ];

  for (const book of books) {
    await prisma.book.create({ data: book });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
