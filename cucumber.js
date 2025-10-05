const defaultOptions = `--require ./api_test/features/steps/**/*.js`;
const featuresPath = `./api_test/features/`;

module.exports = {
  default: `${defaultOptions} ${featuresPath}**/*.feature`,

  // O perfil 'book' executa apenas o arquivo book_rental.feature.
  book: `${defaultOptions} ${featuresPath}bookManagement.feature`,

  // O perfil 'user' executa apenas o arquivo user_management.feature.
  user: `${defaultOptions} ${featuresPath}userManagement.feature`,

  // O perfil 'web' executa apenas o arquivo web_test.feature.
  web: `--require ./web_test/frontend_1/steps/**/*.js ./web_test/frontend_1/features/**/*.feature`
};