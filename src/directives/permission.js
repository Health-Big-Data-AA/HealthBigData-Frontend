// src/directives/permission.js
import { useUserStore } from '@/stores/user'

export default {
  mounted(el, binding) {
    const { value } = binding;
    const userStore = useUserStore();

    if (value && typeof value === 'string') {
      const hasPermission = userStore.hasPermission(value);
      if (!hasPermission) {
        // 如果没有权限，则从DOM中移除该元素
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`需要指定权限字符串，例如 v-permission="'user:manage'"`);
    }
  }
}
