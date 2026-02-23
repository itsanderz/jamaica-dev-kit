import DefaultTheme from 'vitepress/theme'
import Home from './components/Home.vue'
import PlaygroundTRN from './components/playground/PlaygroundTRN.vue'
import PlaygroundPhone from './components/playground/PlaygroundPhone.vue'
import PlaygroundCurrency from './components/playground/PlaygroundCurrency.vue'
import PlaygroundPayroll from './components/playground/PlaygroundPayroll.vue'
import PlaygroundAddress from './components/playground/PlaygroundAddress.vue'
import PlaygroundFees from './components/playground/PlaygroundFees.vue'
import PlaygroundHolidays from './components/playground/PlaygroundHolidays.vue'
import PlaygroundParish from './components/playground/PlaygroundParish.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: any }) {
    app.component('Home', Home)
    app.component('PlaygroundTRN', PlaygroundTRN)
    app.component('PlaygroundPhone', PlaygroundPhone)
    app.component('PlaygroundCurrency', PlaygroundCurrency)
    app.component('PlaygroundPayroll', PlaygroundPayroll)
    app.component('PlaygroundAddress', PlaygroundAddress)
    app.component('PlaygroundFees', PlaygroundFees)
    app.component('PlaygroundHolidays', PlaygroundHolidays)
    app.component('PlaygroundParish', PlaygroundParish)
  },
}
