import { ref, onUnmounted } from 'vue';

const VERSION_KEY = 'app_version';

/** 轮询检查版本更新，发现新版本弹窗提示用户刷新 */
export function useVersionCheck(intervalMs = 5 * 60 * 1000) {
  const hasUpdate = ref(false);
  let timer: ReturnType<typeof setInterval> | null = null;
  let newVersion = '';

  const check = async () => {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`);
      if (!res.ok) return;
      const { version } = await res.json();

      const localVersion = localStorage.getItem(VERSION_KEY);
      if (localVersion && localVersion !== version) {
        hasUpdate.value = true;
        newVersion = version;
      }
      localStorage.setItem(VERSION_KEY, version);
    } catch {
      // 网络异常时忽略
    }
  };

  const refresh = () => {
    localStorage.setItem(VERSION_KEY, newVersion);
    location.reload();
  };

  const start = () => {
    check();
    timer = setInterval(check, intervalMs);
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  onUnmounted(stop);

  return { hasUpdate, start, stop, refresh };
}
