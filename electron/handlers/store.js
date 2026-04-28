const Store = require('electron-store')

const store = new Store({
  name: 'nova-data',
  defaults: {
    settings: {
      searchEngine:  'google',
      homepage:      'nova://home',
      adblock:       true,
      groqApiKey:    '',
      groqModel:     'llama3-8b-8192',
      weatherApiKey: '',
      ubiquitiIP:    '172.16.1.7',
      ubiquitiUser:  'ubnt',
      ubiquitiPass:  '',
      timezone:      'America/Havana',
      downloadPath:  '',
      downloadParts: 4,
      proxyEnabled:  false,
      proxyAccount:  null,
    },
    theme:       'dark',
    accentColor: 'violet',
    bookmarks:   [],
    history:     [],
    downloads:   [],
    extensions:  [],
    showBookmarksBar: true,
    proxyAccounts: [],
  }
})

module.exports = store