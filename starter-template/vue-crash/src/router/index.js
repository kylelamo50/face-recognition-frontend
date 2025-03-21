import {createRouter, createWebHistory} from 'vue-router'
import TestView from '@/views/TestView.vue'
import CompareView from '@/views/CompareView.vue'
import BaseView from '@/views/BaseView.vue';
import Base2View from '@/views/Base2View.vue';
import Base3View from '@/views/Base3View.vue';


const router=createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path:'/',
        name:'test',
        component: TestView
    },
    {
      path:'/compare',
      name:'compare',
      component: CompareView
  },
  {
    path:'/base',
    name:'base',
    component: BaseView
},
{
  path:'/base2',
  name:'base2',
  component: Base2View
},
{
  path:'/base3',
  name:'base3',
  component: Base3View
}
  ]
});

export default router;