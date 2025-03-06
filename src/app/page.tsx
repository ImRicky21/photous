import CameraComponent from "@/components/camera";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="p-10">
          <h1 className="text-center text-2xl font-bold font-bold">
            Wellcome to{" "}
            <span className="text-slate-400 text-4xl ">
              &rdquo;Photous&rdquo;
            </span>
          </h1>
          <CameraComponent />
        </div>
      </main>
    </div>
  );
}
