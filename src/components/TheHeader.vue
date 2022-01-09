<template>
  <header class="m-auto mb-6">
      <img class="object-top absolute top-0 " srcset="images/background.png" alt="">
      <div>
        <nav class="relative flex justify-center items-center">
        <div class="mr-nav  flex items-center justify-center">
          <a class="mx-menu font-Graphik font-normal  text-link text-white" v-for="menu in menus" :key="menu"> {{menu.value}}</a>
          <img class="mx-menu" src="images/contentlogodark.png">
        </div>
        <div class="ml-nav flex items-center">
        <a class="mx-social" v-for="icon in social" :key="icon.name"> <img :src="icon.link" :alt="icon.name"></a>
        </div>
      </nav>
      <div class="m-auto center relative w-672px h-168px text-white bg-center">
        <p class="font-Graphik text-8xl leading-[85px] font-bold p-0">{{pageTitle}}</p>
      </div>
      <div class="m-auto mt-8 center relative w-766px h-80px text-white bg-center">
        <p class=" font-Graphik text- font-bold p-0">{{pageDescription}}</p>
      </div>
      <button class="relative bg-blue-500 border-blue-500 rounded-full w-256px h-52px text-white ">Try for free</button>
      </div>
  </header>
</template>

<script>
export default {
  name:'TheHeader',
  data(){
    return {
      test:"test",
      menus:[{value:"Home"}, {value:"Product"}, {value:"Pricing"}, {value:"About"}, {value:"Contact"}],
      social:[{name:"tweeter",link:"images/tweeter.png"},{name:"facebook",link:"images/fb.png"},{name:"linkedin",link:"images/linkedin.png"},],
      pageTitle:'The best products starts with Figma',
      pageDescription:`calendars are designed for teams. Slate is designed 
f                 for freelancers`
      }
  },

}
</script>

<style>


</style>