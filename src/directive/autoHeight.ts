export default {
  mounted: function (el: any, binding: any) {
    const { value } = binding;
    changeElHeight(el, value);
  },
  updated: function (el: any, binding: any) {
    const { value } = binding;
    changeElHeight(el, value);
  },
};
const changeElHeight = (el: any, value: any) => {
  const searchRef = el.previousElementSibling;
  if (value) {
    el.style.height = `calc(100% - ${(searchRef.clientHeight + 20) / 100}rem)`;
  } else {
    el.style.height = '100%';
  }
};
