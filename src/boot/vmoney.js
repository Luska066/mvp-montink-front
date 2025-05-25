import { defineBoot } from '#q-app/wrappers'
import {VMoney} from 'v-money'
export default defineBoot(async ({app}) => {
  app.directive('money',VMoney)
})
