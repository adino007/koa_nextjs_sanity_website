export default function Toggle() {
	return (
		<label className="[grid-area:toggle] md:hidden">
			<input id="header-open" type="checkbox" hidden />
			<span className="text-2xl font-bold header-closed:hidden">X</span>
			<span className="text-6xl header-open:hidden">≡</span>
		</label>
	)
}
