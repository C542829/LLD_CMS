<template>
  <div class="login-container">
    <!-- 登录的表单 -->
    <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForms" label-position="top">
      <h1>刘丽德健康管理运营系统</h1>
      <h2>请输入您的门店账号信息登录</h2>
      <!-- <el-form-item prop="orgCode" class="form-item">
        <el-input :prefix-icon="HomeFilled" v-model="loginForm.orgCode"></el-input>
      </el-form-item> -->
      <el-form-item prop="username" label="账号" class="form-item">
        <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码" class="form-item">
        <el-input
          :prefix-icon="Lock"
          type="password"
          v-model="loginForm.password"
          show-password
          @keydown.prevent.enter="login"
        ></el-input>
      </el-form-item>
      <el-form-item class="form-item">
        <el-button :loading="loading" @click="login" class="login-btn" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="layer1"></div>
  <div class="layer2"></div>
  <div class="layer3"></div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { reqLogin } from '@/api/user/index';
import useUserStore from '@/store/modules/acl/user';

const store = useUserStore();

// 获取el-form组件
const loginForms = ref();
// 获取路由器
const router = useRouter();
// 路由对象
const route = useRoute();

// 收集账号与密码的数据
// const loginForm = reactive({ orgCode: '1', username: '', password: '' });
const loginForm = reactive({ username: '', password: '' });

// 登录加载状态
const loading = ref(false);

// 登录按钮回调
const login = async () => {
  try {
    // 启用加载状态
    loading.value = true;

    // 表单验证
    await loginForms.value.validate();
    // 登录
    const res = await reqLogin(loginForm);
    store.setAuth(res.data);
    await store.initAfterLogin();
    router.push({ path: '/' });
  } catch (error) {
  } finally {
    // 禁用加载状态
    loading.value = false;
  }
};

// 定义表单校验需要配置对象
const rules = {
  // orgCode: [{ required: true, message: '请输入门店编码', trigger: 'blur' }],
  username: [{ required: true, min: 2, max: 20, message: '账号长度2-20位', trigger: 'blur' }],
  password: [{ required: true, min: 3, max: 20, message: '密码长度3-20位', trigger: 'blur' }],
};
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: var(--el-text-color-primary);
  background-color: var(--el-color-primary-light-5);

  .login-form {
    padding: 30px;
    width: 360px;
    border-radius: 20px;
    border: 1px solid #fff;
    transform: translateY(-30px);
    background: var(--el-bg-color);
    transition: 0.5s ease;
    &:hover {
      border: 1px solid var(--el-color-primary);
      box-shadow: 0 4px 10px 4px var(--el-color-primary-light-3);
      // box-shadow: var(--el-box-shadow);
    }
    h1 {
      // color: white;
      color: var(--el-color-primary);
      font-weight: 600;
      font-size: 24px;
      text-align: center;
      // font-size: 40px;
    }

    h2 {
      text-align: center;
      font-size: 14px;
      // color: white;
      color: var(--el-color-primary);
      // margin: 20px 0px 30px 0px;
      margin: 16px 0px;
    }

    .form-item {
      margin-bottom: 16px;
    }

    .login-btn {
      width: 100%;
    }
  }
}

@function getShow($n) {
  $shadow: unquote('#{random(100)}vw') unquote('#{random(100)}vh') #fff;
  @for $i from 2 through $n {
    $shadow: '#{$shadow}' + ',' + '#{unquote('#{random(100)}vw') unquote('#{random(100)}vh') #fff}';
  }

  @return unquote($string: $shadow);
}
$count: 400;
$time: 100;
@for $i from 1 through 3 {
  $size: #{$i}px;
  $count: floor(
    $number: calc($count / 2),
  );
  $time: floor(
    $number: calc($time / 2),
  );
  .layer#{$i} {
    position: fixed;
    width: $size;
    height: $size;
    top: 0;
    left: 0;
    border-radius: $size;
    background-color: white;
    box-shadow: 10px 10px #fff, 15px 15px #fff;
    box-shadow: getShow($count);
    animation: moveUp #{$time}s linear infinite;
    // 利用为元素
    &::after {
      content: '';
      position: fixed;
      left: 0;
      top: 100vh;
      width: $size;
      height: $size;
      border-radius: inherit;
      box-shadow: inherit;
    }
  }
}

@keyframes moveUp {
  100% {
    transform: translateY(-100vh);
  }
}
</style>
