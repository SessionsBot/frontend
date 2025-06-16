import { useRoute, useRouter } from 'vue-router'

export const global = {
    // Routes & Navigation:
    inviteBotUsingDiscord: () => {
        window.open('https://discord.com/oauth2/authorize?client_id=1137768181604302848', '_blank')
    }
}

