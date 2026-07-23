import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const CreatePost = () => {
  return (
    <div className="p-3 max-w-3xl w-full mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create Post</h1>
      <form action="" className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput 
                    type="text"
                    placeholder="Title"
                    required
                    id="title"
                    className="flex-1"
                />
                <Select>
                    <option value="uncategorizes">Selectionne une categorie</option>
                    <option value="javascript">Javascript</option>
                    <option value="reactjs">React.js</option>
                    <option value="nextjs">Next.js</option>
                </Select>
            </div>
            <div 
                className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3"
            >
                <FileInput
                    type="file"
                    accept="image/*"
                />
                <Button
                    type="button"
                    size="sm"
                    outline
                    className="cursor-pointer"
                >
                    Upload image
                </Button>
            </div>
            <ReactQuill 
                theme="snow" 
                placeholder="Contenue"
                className="h-80 mb-12"
                required
            />
            <Button
                type="submit"
                outline
                className="cursor-pointer"
            >
                Publier
            </Button>
      </form>
    </div>
  )
}

export default CreatePost
