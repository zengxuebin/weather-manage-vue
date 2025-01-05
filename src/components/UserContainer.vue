<template>
  <div class="container">

    <el-icon size="large" color="#00796a" class="icon">
      <UserFilled />
    </el-icon>
    <span>{{ userStore.dept.deptName }}-{{ userStore.user.nickname }}</span>
    <div class="user">
      <el-avatar size="small" :src="circleUrl" class="avatar" />
      <el-dropdown class="el-dropdown-container">
        <span class="el-dropdown-link">
          <span>{{ userStore.user.nickname }}</span>
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item><el-icon>
                <Lock />
              </el-icon><span @click="dialogFormVisible = true">修改密码</span></el-dropdown-item>
            <el-dropdown-item divided>
              <el-icon>
                <SwitchButton />
              </el-icon>
              <span @click="userStore.logoutUser">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500" align-center @closed="resetForm">
      <el-form ref="ruleFormRef" style="max-width: 500px" :model="passwordForm" :rules="rules" label-width="auto"
        status-icon>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkNewPassword">
          <el-input v-model="passwordForm.checkNewPassword" type="password" placeholder="请再次输入新密码" autocomplete="off" />
        </el-form-item>
        <div class="footer">
          <el-button @click="closeDialog()">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            确认
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import useUserStore from "@/stores/user"
import { reactive, ref } from "vue"
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { changePassword } from "@/api/auth";

const userStore = useUserStore()
const circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

const ruleFormRef = ref<FormInstance>()

interface PasswordForm {
  oldPassword: string,
  newPassword: string,
  checkNewPassword: string,
}
const passwordForm = reactive<PasswordForm>({
  oldPassword: '',
  newPassword: '',
  checkNewPassword: ''
})

const resetForm = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.checkNewPassword = ''
}

const closeDialog = () => {
  dialogFormVisible.value = false
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'))
  } else {
    if (passwordForm.checkNewPassword !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkNewPassword')
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== passwordForm.newPassword) {
    callback(new Error("两次密码输入不一致"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<PasswordForm>>({
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' },
  ],
  newPassword: [
    { validator: validatePass, required: true, trigger: 'blur' }
  ],
  checkNewPassword: [
    { validator: validatePass2, required: true, trigger: 'blur' }
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      ElMessageBox.confirm(
        '密码修改成功后，您将自动重新登录. 是否继续?',
        '警告',
        {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          changePassword(passwordForm).then(res => {
            dialogFormVisible.value = false
            ElMessage({
              type: 'success',
              message: '密码修改成功',
            })
            userStore.logoutUser()
          })

        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '修改密码取消',
          })
        })
    } else {
      console.log('error submit!', fields)
    }
  })
}

</script>

<style lang="scss" scoped>
.container {
  height: 40px;
  background-color: #fff;
  border-radius: 5px;
  float: right;
  line-height: 40px;
  padding: 0 20px;
}

.icon {
  margin-right: 5px;
  position: relative;
  top: 2px;
}

.user {
  display: inline;
  float: right;
  margin-left: 10px;
}

.avatar {
  position: relative;
  top: 5px;
}

.el-dropdown-container {
  margin-left: 5px;
  line-height: 40px;
  border: 0;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;

  & span {
    font-size: 18px;
  }
}

:focus {
  outline: 0
}

.footer {
  text-align: right;
}
</style>
