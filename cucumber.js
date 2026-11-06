module.exports = {
  default: {
    paths: ['UI/tests/features/**/*.feature', 'API/tests/features/**/*.feature'],
    requireModule: ['tsx/cjs'],
    require: ['support/**/*.ts', 'UI/steps/**/*.ts', 'API/steps/**/*.ts'],
    format: ['summary', 'allure-cucumberjs/reporter', 'junit:junit.xml'],
    parallel: 2,
    retry: 1,
    publishQuiet: true,
  },
};