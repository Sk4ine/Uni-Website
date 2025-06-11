import { useEffect, useState } from "react";
import { useAdminPanelContext } from "../contexts/adminPanelContext";
import { LoadingMessage } from "./Common";
import { ProductCategory } from "../classes/productCategory";
import { Product } from "../classes/product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  addCategory,
  addProduct,
  deleteCategory,
  deleteProduct,
  updateCategory,
  updateProduct,
} from "../api/requests/admin";
import { getCategoryList } from "../api/requests/categories";

export function DatabaseEditSection() {
  return (
    <div className="flex flex-col items-center mt-12">
      <TableSelector></TableSelector>
      <TableEditor></TableEditor>
    </div>
  );
}

function TableSelector() {
  return (
    <div className="flex justify-center items-center gap-5">
      <TableSelectButton buttonText="Категории" tableName="categories"></TableSelectButton>
      <TableSelectButton buttonText="Продукты" tableName="products"></TableSelectButton>
    </div>
  );
}

function TableSelectButton({ buttonText, tableName }: { buttonText: string; tableName: string }) {
  const { activeTable, switchActiveTable } = useAdminPanelContext();

  const backgroundColor: string = activeTable == tableName ? "bg-[#F5D4D5]" : "bg-[#E2E2E2]";
  const textColor: string = activeTable == tableName ? "text-[#EF829A]" : "text-[#979797]";
  const backgroundHoverColor: string =
    activeTable == tableName ? "hover:bg-[#E6C8C9]" : "hover:bg-[#D1D1D1]";

  function handleClick() {
    switchActiveTable(tableName);
  }

  return (
    <button
      onClick={handleClick}
      className={`${backgroundColor} ${textColor} ${backgroundHoverColor} font-default text-3xl w-64 py-1 flex justify-center items-center rounded-2xl cursor-pointer`}
    >
      {buttonText}
    </button>
  );
}

function TableEditor() {
  const { activeTable, tableData, tableRecords, loadingRecords } = useAdminPanelContext();
  const [categoryList, setCategoryList] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    async function loadOptions() {
      try {
        setCategoryList(await getCategoryList());
        setLoadingCategories(false);
      } catch (error) {
        console.log(error);
      }
    }

    loadOptions();
  }, []);

  if (loadingRecords || loadingCategories) {
    return <LoadingMessage text="Загрузка таблицы..." heightVH={50}></LoadingMessage>;
  }

  let recordNodes: React.ReactNode[] = [];

  switch (activeTable) {
    case "categories":
      recordNodes = (tableRecords as ProductCategory[]).map((category) => (
        <tr
          key={category.id}
          className="border-2 border-font-darkgray/50 border-x-0 last:border-b-0"
        >
          <td className="font-default text-font-darkgray text-xl py-1 text-center border-r-2 border-font-darkgray/50">
            {category.id}
          </td>
          <CategoryCell id={category.id} name={category.name}></CategoryCell>
        </tr>
      ));
      break;
    case "products":
      recordNodes = (tableRecords as Product[]).map((product) => {
        const categoryName: string | undefined = categoryList.find(
          (category) => category.id == product.categoryID,
        )?.name;

        if (!categoryName) {
          throw new Error("categoryName is undefined");
        }

        return (
          <tr
            key={product.id}
            className="border-2 border-font-darkgray/50 border-x-0 last:border-b-0"
          >
            <td className="font-default text-font-darkgray text-xl py-1 text-center border-r-2 border-font-darkgray/50">
              {product.id}
            </td>
            <ProductCell
              id={product.id}
              name={product.name}
              price={product.price}
              categoryName={categoryName}
              imagePath={product.imagePaths[0]}
            ></ProductCell>
          </tr>
        );
      });
      break;
    default:
      throw new Error("activeTable value is invalid");
  }

  let editForm: React.ReactNode = <></>;

  switch (activeTable) {
    case "categories":
      editForm = <CategoryEditForm></CategoryEditForm>;
      break;
    case "products":
      editForm = <ProductEditForm></ProductEditForm>;
  }

  return (
    <div>
      <table className="w-[1000px] mt-6 rounded-xl font-default shadow-[-2px_0px_4px_rgb(0,0,0,0.25),2px_4px_4px_rgb(0,0,0,0.25)]">
        <tbody>
          <tr className="text-font-darkgray text-xl">
            <th className="py-1 w-[20%] border-r-2 border-font-darkgray/50">ID</th>
            <th className="py-1 w-[80%] border-l-2 border-font-darkgray/50">{tableData.header}</th>
          </tr>

          {recordNodes}

          <AddRecordButton></AddRecordButton>
        </tbody>
      </table>
      {editForm}
      <DeleteConfirmDialog></DeleteConfirmDialog>
    </div>
  );
}

function CategoryCell({ id, name }: { id: number; name: string }) {
  return (
    <CellBase>
      <div className="font-default text-font-darkgray text-xl ml-2">
        <p>{name}</p>
      </div>
      <EditButtons recordID={id}></EditButtons>
    </CellBase>
  );
}

function ProductCell({
  id,
  name,
  price,
  categoryName,
}: {
  id: number;
  name: string;
  price: number;
  categoryName: string;
  imagePath: string;
}) {
  return (
    <CellBase>
      <div className="flex gap-5 items-center font-default text-font-darkgray text-xl ml-2">
        <p>{name}</p>
        <p>{categoryName}</p>
        <p>{price} руб.</p>
      </div>
      <EditButtons recordID={id}></EditButtons>
    </CellBase>
  );
}

function CellBase({ children }: { children: React.ReactNode }) {
  return <td className="flex justify-between items-center py-2">{children}</td>;
}

function EditButtons({ recordID }: { recordID: number }) {
  const { activeTable, setEditIsOpen, setSelectedRecord, setDeleteIsOpen } = useAdminPanelContext();

  function handleEdit() {
    setSelectedRecord(recordID);
    setEditIsOpen(true);
  }

  function handleDelete() {
    setSelectedRecord(recordID);
    setDeleteIsOpen(true);
  }

  if (activeTable == "categories" && recordID == 1) {
    return;
  }

  return (
    <div className="flex justify-between items-center font-default gap-2 mr-4">
      <button
        onClick={handleEdit}
        className="bg-[#E2E2E2] hover:bg-[#D1D1D1] py-1 px-3 rounded-xl cursor-pointer"
      >
        Редактировать
      </button>
      <button
        onClick={handleDelete}
        className="bg-[#F5D4D5] hover:bg-[#E6C8C9] py-1 px-3 rounded-xl cursor-pointer"
      >
        Удалить
      </button>
    </div>
  );
}

function CategoryEditForm() {
  const {
    editIsOpen,
    tableRecords,
    setEditIsOpen,
    selectedRecord,
    setSelectedRecord,
    updateTableRecords,
  } = useAdminPanelContext();

  function handleClose() {
    setSelectedRecord(0);
    setEditIsOpen(false);
  }

  function handleSave(formData: FormData) {
    async function saveCategory() {
      try {
        await updateCategory(
          localStorage.getItem("jwtToken"),
          selectedRecord,
          formData.get("name") as string,
        );
        updateTableRecords(false);
      } catch (error) {
        console.log(error);
      }
    }

    saveCategory();
    setSelectedRecord(0);
    setEditIsOpen(false);
  }

  if (!editIsOpen) {
    return;
  }

  const categoryData: ProductCategory | undefined = tableRecords.find(
    (category) => category.id == selectedRecord,
  ) as ProductCategory | undefined;

  if (!categoryData) {
    throw new Error("categoryData is undefined");
  }

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black/50 z-50">
      <form
        action={handleSave}
        className="flex flex-col items-center font-default text-xl bg-white rounded-2xl px-4 pt-4 pb-2"
      >
        <div className="flex justify-end w-full">
          <button onClick={handleClose} className="cursor-pointer">
            <FontAwesomeIcon icon={faClose} size="xl"></FontAwesomeIcon>
          </button>
        </div>
        <div className="flex flex-col items-center py-4 px-6">
          <p className="text-3xl">Редактировать категорию</p>
          <EditFormInputField
            defaultValue={categoryData.name}
            type="text"
            name="name"
            labelText="Название"
          ></EditFormInputField>
          <button
            type="submit"
            className="bg-[#F5D4D5] hover:bg-[#E6C8C9] py-1 px-7 rounded-xl mt-4 text-2xl cursor-pointer"
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
}

function ProductEditForm() {
  const {
    editIsOpen,
    tableRecords,
    setEditIsOpen,
    selectedRecord,
    setSelectedRecord,
    updateTableRecords,
  } = useAdminPanelContext();
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categoryList, setCategoryList] = useState<ProductCategory[]>([]);

  function handleClose() {
    setSelectedRecord(0);
    setEditIsOpen(false);
  }

  function handleSave(formData: FormData) {
    async function saveProduct() {
      try {
        const newFormData = new FormData();
        newFormData.append("imageFile", formData.get("imageFile") as File);

        await updateProduct(
          localStorage.getItem("jwtToken"),
          selectedRecord,
          new Product(
            selectedRecord,
            parseInt(formData.get("categoryID") as string),
            formData.get("name") as string,
            parseInt(formData.get("price") as string),
            (formData.get("materials") as string).replace(" ", "").split(","),
            parseInt(formData.get("weightInGrams") as string),
            parseInt(formData.get("quantityInStock") as string),
            formData.get("countryOfOrigin") as string,
          ),
          newFormData,
        );
        updateTableRecords(false);
      } catch (error) {
        console.log(error);
      }
    }

    saveProduct();
    setSelectedRecord(0);
    setEditIsOpen(false);
  }

  useEffect(() => {
    async function loadOptions() {
      try {
        setCategoryList(await getCategoryList());
        setLoadingCategories(false);
      } catch (error) {
        console.log(error);
      }
    }

    loadOptions();
  }, []);

  if (!editIsOpen) {
    return;
  }

  const productData: Product | undefined = tableRecords.find(
    (product) => product.id == selectedRecord,
  ) as Product | undefined;

  if (!productData) {
    throw new Error("productData is undefined");
  }

  const categoryOptions = categoryList.map((category, index) => (
    <option key={index} value={category.id} className="font-default text-xl">
      {category.name}
    </option>
  ));

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black/50 z-50">
      <form
        action={handleSave}
        className="flex flex-col items-center font-default text-xl bg-white rounded-2xl px-4 pt-4 pb-4"
      >
        {loadingCategories ? (
          <p className="font-default text-font-gray text-2xl">Загрузка формы...</p>
        ) : (
          <>
            <div className="flex justify-end w-full">
              <button onClick={handleClose} className="cursor-pointer">
                <FontAwesomeIcon icon={faClose} size="xl"></FontAwesomeIcon>
              </button>
            </div>
            <p className="text-3xl">Редактировать товар</p>
            <div className="flex flex-col items-center gap-4 py-4 px-6 max-h-[75vh] overflow-y-scroll">
              <EditFormDropDownMenu
                defaultValue={productData.categoryID}
                name="categoryID"
                labelText="Категория"
                options={categoryOptions}
              ></EditFormDropDownMenu>
              <EditFormInputField
                defaultValue={productData.name}
                type="text"
                name="name"
                labelText="Название"
              ></EditFormInputField>
              <EditFormInputField
                defaultValue={productData.price}
                type="number"
                name="price"
                labelText="Цена"
              ></EditFormInputField>
              <EditFormInputField
                defaultValue={productData.materials.join(",")}
                type="text"
                name="materials"
                labelText="Материалы"
              ></EditFormInputField>
              <EditFormInputField
                defaultValue={productData.weightGrams}
                type="number"
                name="weightInGrams"
                labelText="Вес (г.)"
              ></EditFormInputField>
              <EditFormInputField
                defaultValue={productData.quantityInStock}
                type="number"
                name="quantityInStock"
                labelText="Штук в наличии"
              ></EditFormInputField>
              <EditFormInputField
                defaultValue={productData.countryOfOrigin}
                type="text"
                name="countryOfOrigin"
                labelText="Страна"
              ></EditFormInputField>
              <EditFileUploadField name="imageFile" labelText="Изображение"></EditFileUploadField>
            </div>
            <button
              type="submit"
              className="bg-[#F5D4D5] hover:bg-[#E6C8C9] text-font-pink py-1 px-7 rounded-xl mt-4 text-2xl cursor-pointer"
            >
              Сохранить
            </button>
          </>
        )}
      </form>
    </div>
  );
}

function DeleteConfirmDialog() {
  const {
    activeTable,
    updateTableRecords,
    selectedRecord,
    setSelectedRecord,
    setDeleteIsOpen,
    tableRecords,
    deleteIsOpen,
  } = useAdminPanelContext();

  function handleConfirm() {
    async function deleteRecord() {
      try {
        switch (activeTable) {
          case "categories":
            await deleteCategory(localStorage.getItem("jwtToken"), selectedRecord);
            updateTableRecords(false);
            break;
          case "products":
            await deleteProduct(localStorage.getItem("jwtToken"), selectedRecord);
            updateTableRecords(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    deleteRecord();
    setSelectedRecord(0);
    setDeleteIsOpen(false);
  }

  function handleCancel() {
    setSelectedRecord(0);
    setDeleteIsOpen(false);
  }

  if (!deleteIsOpen) {
    return;
  }

  const recordData: ProductCategory | Product | undefined = tableRecords.find(
    (category) => category.id == selectedRecord,
  );

  if (!recordData) {
    throw new Error("recordData is undefined");
  }

  let text: string = "";

  switch (activeTable) {
    case "categories":
      text = `Вы точно хотите удалить категорию "${(recordData as ProductCategory).name}"?`;
      break;
    case "products":
      text = `Вы точно хотите удалить товар "${(recordData as Product).name}"?`;
  }

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-black/50 z-50">
      <div className="flex flex-col items-center bg-white rounded-2xl px-4 py-4">
        <p className="font-default text-font-darkgray text-2xl max-w-[80%] text-center">{text}</p>
        <div className="flex justify-between items-center font-default text-2xl gap-5 mt-4">
          <button
            onClick={handleConfirm}
            className="bg-[#F5D4D5] hover:bg-[#E6C8C9] py-1 px-3 rounded-xl cursor-pointer"
          >
            Подтвердить
          </button>
          <button
            onClick={handleCancel}
            className="bg-[#E2E2E2] hover:bg-[#D1D1D1] py-1 px-3 rounded-xl cursor-pointer"
          >
            Отменить
          </button>
        </div>
      </div>
    </div>
  );
}

function EditFormInputField({
  name,
  labelText,
  type,
  defaultValue,
}: {
  name: string;
  labelText: string;
  type: string;
  defaultValue?: string | number;
}) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={name}>{labelText}</label>
      <input
        defaultValue={defaultValue}
        id={name}
        type={type}
        name={name}
        className="border-2 px-2 py-1 border-font-darkgray outline-none rounded-xl"
      ></input>
    </div>
  );
}

function EditFormDropDownMenu({
  name,
  labelText,
  options,
  defaultValue,
}: {
  name: string;
  labelText: string;
  options: React.ReactNode;
  defaultValue: number;
}) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor="categoryID">{labelText}</label>
      <select
        id="categoryID"
        defaultValue={defaultValue}
        name={name}
        className="border-2 px-2 py-1 border-font-darkgray outline-none rounded-xl"
      >
        {options}
      </select>
    </div>
  );
}

function EditFileUploadField({ name, labelText }: { name: string; labelText: string }) {
  return (
    <div className="flex flex-col">
      <label htmlFor="image">{labelText}</label>
      <input
        id="image"
        type="file"
        name={name}
        accept="image/*"
        className="border-2 border-font-darkgray aspect-square rounded-xl cursor-pointer"
      ></input>
    </div>
  );
}

function AddRecordButton() {
  const { activeTable, updateTableRecords } = useAdminPanelContext();

  function handleAdd() {
    async function add() {
      try {
        switch (activeTable) {
          case "categories":
            await addCategory(localStorage.getItem("jwtToken"));
            updateTableRecords(false);
            break;
          case "products":
            await addProduct(localStorage.getItem("jwtToken"));
            updateTableRecords(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    add();
  }

  return (
    <tr>
      <td colSpan={2} className="text-center">
        <button
          onClick={handleAdd}
          className="w-full h-full cursor-pointer py-2 text-font-pink hover:text-font-pink-hover hover:bg-gray-50 rounded-b-xl"
        >
          <FontAwesomeIcon icon={faPlus} size="xl" className=""></FontAwesomeIcon>
        </button>
      </td>
    </tr>
  );
}
