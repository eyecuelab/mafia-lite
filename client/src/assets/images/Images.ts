import GhostFrame from "./image_118.png";
import CultistBadge from "./ui/Cultist_Badge.png";
import AccuseBadge from "./ui/image_35.png";
import MurderBadge from "./ui/image_51.png";
import MurderedBadge from "./ui/image_104.png";
import JailedBadge from "./ui/image_105.png";
import TerminatedBadge from "./ui/image_180.png";
import TitleImage from "./Title.png";
import ButtonImage from "./ui/image_15.png";
import MirrorImage from "../../assets/images/image_118_smoke.png";

const NUM_GHOST_IMAGES = 30;

const GhostImages = (() => {
	const images: string[] = [];
	for (let i = 0; i < NUM_GHOST_IMAGES; i++) {
		const image = `./ghost_images/image_${i}.png`;
		images.push(image);
	}

	return images;
})();

export { GhostFrame, CultistBadge, AccuseBadge, MurderBadge, MurderedBadge, JailedBadge, TerminatedBadge, GhostImages, TitleImage, ButtonImage, MirrorImage};