import { useActiveTableContext } from "../contexts/activeTableContext";
import { useAdminPanelContext } from "../contexts/adminPanelContext";

export function DatabaseEditSection() {
  return (
    <div className='flex flex-col items-center mt-12'>
      <TableSelector></TableSelector>
    </div>
  )
}

function TableSelector() {
  return(
    <div className='flex justify-center items-center gap-5'>
      <TableSelectButton buttonText='Категории' tableName='categories'></TableSelectButton>
      <TableSelectButton buttonText='Продукты' tableName='products'></TableSelectButton>
    </div>
  )
}

function TableEditor() {
  

  return (
    <table>

    </table>
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
  const {activeTable, switchActiveTable} = useAdminPanelContext();
  
  const backgroundColor: string = activeTable == tableName ? "bg-[#F5D4D5]" : "bg-[#E2E2E2]";
  const textColor: string = activeTable == tableName ? "text-[#EF829A]" : "text-[#979797]";
  const backgroundHoverColor: string = activeTable == tableName ? "hover:bg-[#E6C8C9]" : "hover:bg-[#D1D1D1]";

  function handleClick() {
    switchActiveTable(tableName);
  }

  return (
    <button onClick={handleClick} className={`${backgroundColor} ${textColor} ${backgroundHoverColor} font-default text-3xl w-64 py-1 flex justify-center items-center rounded-2xl cursor-pointer`}>{buttonText}</button>
  )
}