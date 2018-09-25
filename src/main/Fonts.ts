const binding = require('./binding.node');

interface IFontsFigmaItem {
	postscript: string;
	family: string;
	id: string;
	style?: string;
	weight?: number;
	stretch?: number;
	italic?: boolean;
}

interface IFonts {
	[path: string]: Array<IFontsFigmaItem>
}

class Fonts {
	public static getFonts = (dirs: Array<string>): IFonts => {
		let fonts: IFonts = {};

		try {
			fonts = binding.getFonts(dirs);

		} catch (error) {
			console.log('load fonts error: ', error);
		}

		return fonts;
	}

	public static updateFonts = () => {
		return Fonts.getFonts([
			'/usr/share/fonts',
			`${process.env.HOME}/.local/share/fonts`
		]);
	}
}

export default Fonts;