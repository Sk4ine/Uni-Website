import { HomePageButton } from './LoginForm';
import { AccountButton } from './NavigationBar';

export function AdminNavigationBar() {

  return (
    <div className={`flex items-end gap-5 justify-between h-40 bg-white box-content border-b-4 border-[#EF829A]`}>
      <div className='w-[40%] h-[80%] flex justify-end items-center'>
        <HomePageButton></HomePageButton>
      </div>
      
      <div className='min-w-[20%] h-[80%] flex justify-center items-center'>
        <p className='font-default text-5xl text-[#EF829A] text-nowrap'>Админ панель</p>
      </div>

      <div className='w-[40%] h-[70%] flex justify-start items-center'>
        <AccountButton></AccountButton>
      </div>
    </div>
  )
}