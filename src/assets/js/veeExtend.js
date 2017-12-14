  import VeeValidate,{Validator} from 'vee-validate'

  Validator.extend('phone', {
    messages: {
      cn:field => field + '格式错误',
    },
    validate: value => {
      return value.length == 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
    }
  });
  Validator.extend('cnName', {
    messages: {
      cn:field => field + '格式错误',
    },
    validate: value => {
      return /^[\u4E00-\u9FA5\uF900-\uFA2D\w]+$/.test(value)
    }
  });
  Validator.extend('mail', {
    messages: {
      cn:field => field + '格式错误',
    },
    validate: value => {
      return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)
    }
  });
