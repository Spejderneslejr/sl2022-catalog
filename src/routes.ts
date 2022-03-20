import List from './routes/List.svelte'
import Details from './routes/Details.svelte'
import NotFound from './routes/NotFound.svelte'

// https://github.com/ItalyPaleAle/svelte-spa-router

export default {
  '/': List,

  '/activity/:id': Details,

  // Catch-all
  '*': NotFound,
}
