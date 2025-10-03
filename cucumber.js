// module.exports = {
//   default: "--require ./api_test/features/steps/**/*.js ./api_test/features/**/*.feature"
// }

const defaultOptions = `--require ./api_test/features/steps/**/*.js`;
const featuresPath = `./api_test/features/`;

module.exports = {
  // O perfil 'default' é executado por 'npm test' sem especificar perfil.
  // Ele vai rodar todos os features na pasta.
  default: `${defaultOptions} ${featuresPath}**/*.feature`,

  // O perfil 'book' executa apenas o arquivo book_rental.feature.
  book: `${defaultOptions} ${featuresPath}bookManagement.feature`,

  // O perfil 'user' executa apenas o arquivo user_management.feature.
  user: `${defaultOptions} ${featuresPath}userManagement.feature`
};