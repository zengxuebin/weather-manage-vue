import { login } from "@/api/auth"
import { defineStore } from "pinia"
import { reactive, ref } from 'vue'


const useAppStore = defineStore('app',  () => {
  const collapse = ref(sessionStorage.getItem('collapse') || 'false')
  const activeMenu = ref('')

  function setCollapse(nowCollapse: string) {
    if (nowCollapse == 'false') {
      collapse.value = 'true'
    } else {
      collapse.value = 'false'
    }
    sessionStorage.setItem('collapse', collapse.value)
  }

  function setActiveMenu(menu: any) {
    activeMenu.value = menu
    console.log(activeMenu.value);
  }

  return { collapse, activeMenu, setCollapse, setActiveMenu }
})

export default useAppStore
