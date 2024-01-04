/*
 * @Author: cwd
 * @Date: 2024-01-03 14:55:31
 * @LastEditors: cwd
 * @LastEditTime: 2024-01-04 10:59:49
 * @FilePath: \chromepie-nozhihu\no-fishing-allowed\tailwind.config.cjs
 * @Description: 
 * 
 * Copyright (c) 2024 by cwd, All Rights Reserved. 
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{index,vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ],
  corePlugins: {
    preflight: false,
  }
}
