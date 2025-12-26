export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose?: () => void;
}) {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-transparent text-white"
      onClick={onClose}
    >
      {/* 背景模糊弹窗 */}
      <div
        className="absolute min-w-[280px] min-h-[160px] p-4 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border bg-white/10 border-white/20 rounded-xl z-999 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}
