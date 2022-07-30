import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
    state: () => ({
        logged: false,
        name: '',
        token: '',
    }),
    getters: {
        isLogged(state) {
            return state.logged
        },
        getName(state) {
            return state.name
        },
        getToken(state) {
            return state.token
        }
    },
    actions: {
        setUserData(payload) {
            this.logged = true;
            this.token = payload.tokenId;
            this.name = payload.name + ' ' + payload.lastName;
        }
    }
})

export { useUserStore }
