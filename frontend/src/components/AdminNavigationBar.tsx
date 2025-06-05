import { createContext, useContext, useEffect, useState } from 'react';
import { HomePageButton } from './LoginForm';
import { AccountButton } from './NavigationBar';
import axios from 'axios';
import type { CategoryResponse } from '../api/responses/apiResponses';
import { ProductCategory } from '../classes/productCategory';
import { useActiveTableContext } from '../contexts/activeTableContext';

export function AdminNavigationBar() {

  return (
    <div className={`flex items-end gap-5 justify-between h-40 bg-white box-content border-b-4 border-[#EF829A]`}>
      <div className='w-[40%] h-[80%] flex justify-end items-center'>
        <HomePageButton></HomePageButton>
      </div>
      
      <div className='w-[20%] h-[80%] flex justify-center items-center'>
        <p className='font-default text-5xl text-[#EF829A]'>Админ панель</p>
      </div>

      <div className='w-[40%] h-[70%] flex justify-start items-center'>
        <AccountButton></AccountButton>
      </div>
    </div>
  )
}

export function DatabaseEditSection() {
  return (
    <div className='flex flex-col items-center mt-12'>
      <TableSelector></TableSelector>
    </div>
  )
}

function TableSelector() {
  return(
    <div className='flex justify-center items-center'>
      <TableSelectButton buttonText='Категории' tableName='categories'></TableSelectButton>
      <TableSelectButton buttonText='Продукты' tableName='categories'></TableSelectButton>
    </div>
  )
}

function TableEditBlock() {
  return(
    <div>
      <table>
        <tbody>
          <tr>
            {}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function TableSelectButton({buttonText, tableName} : {buttonText: string, tableName: string}) {
  const activeTableContext = useActiveTableContext();
  
  const backgroundColor: string = activeTableContext.activeTable == tableName ? "bg-[#F5D4D5]" : "bg-[#E2E2E2]";
  const textColor: string = activeTableContext.activeTable == tableName ? "text-[#EF829A]" : "text-[#979797]";
  const backgroundHoverColor: string = activeTableContext.activeTable == tableName ? "hover:bg-[#E6C8C9]" : "hover:bg-[#D1D1D1]";

  function handleClick() {
    activeTableContext.setActiveTable(tableName);
  }

  return (
    <button onClick={handleClick} className={`${backgroundColor} ${textColor} ${backgroundHoverColor} min-h-[100vh] font-default text-3xl w-64 py-1 flex justify-center items-center rounded-2xl cursor-pointer`}>{buttonText}</button>
  )
}