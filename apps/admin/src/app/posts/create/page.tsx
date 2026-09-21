import MainLayout from "@/components/Layouts/MainLayout";
import { PostForm } from "@/components/Blog/PostForm";
import LayoutWithNoTop from "@/components/Layouts/LayoutWithNoTop";

export default async function Page() {
    return (
      <LayoutWithNoTop>
        <PostForm mode="create" />
      </LayoutWithNoTop>
    );
}
