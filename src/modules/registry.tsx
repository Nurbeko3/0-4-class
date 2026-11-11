import type { ComponentType } from 'react'
import type { GameId, TopicId } from '../core/curriculum'
import type { StrKey } from '../i18n/strings'
import { MouseDemo, type MouseAction } from '../ui/MouseDemo'
import * as Art from '../ui/art'
import { PointGame } from './mouse/PointGame'
import { ClickGame } from './mouse/ClickGame'
import { DoubleClickGame } from './mouse/DoubleClickGame'
import { RightClickGame } from './mouse/RightClickGame'
import { DragGame } from './mouse/DragGame'
import { ScrollGame } from './mouse/ScrollGame'
import { FindCyr, FindLat } from './keyboard/FindGame'
import { SpecialGame } from './keyboard/SpecialGame'
import { WordCyr, WordLat } from './keyboard/WordGame'
import { EnterIcon, keyDemo, keyIcon, wordIcon } from './keyboard/kbdArt'
import { PartsMatch, PartsName, PartsUse } from './parts/PartsGame'
import { MatchIcon, TagIcon, UseIcon } from './parts/partsArt'
import { ArrowsGame, NestedGame, RepeatGame } from './robot/RobotGame'
import { ArrowsIcon, NestedIcon, RepeatIcon, RobotDemo } from './robot/rbArt'
import { DeskFile, DeskOpen, DeskSort } from './desktop/DesktopSim'
import { FileArt, TrashArt, WindowIcon } from './desktop/deskArt'
import { ScenarioQuiz } from './safety/ScenarioQuiz'
import { QuizIcon } from './safety/safetyArt'
import { PaintGame } from './paint/PaintGame'
import { PaletteIcon } from './paint/paintArt'
import { ColoringGame } from './coloring/ColoringGame'
import { NumbersIcon } from './coloring/clArt'

export interface GameProps {
  grade: number
  /** O'yin tugaganda bir marta chaqiriladi */
  onWin: () => void
  /** O'yin o'rtasida yo'riqnomani almashtirish (matn + ovoz) */
  setSay: (key: StrKey) => void
}

export interface GameDef {
  title: StrKey
  say: StrKey
  /** Yo'riqnoma yonidagi animatsion ko'rsatma (sichqoncha, klaviatura tugmasi va h.k.) */
  Demo: ComponentType
  icon: ComponentType<{ className?: string }>
  component: ComponentType<GameProps>
}

const mouse = (action: MouseAction) => () => <MouseDemo action={action} />

export const GAMES: Record<GameId, GameDef> = {
  'mouse.point': { title: 'mouse.point.title', say: 'say.mouse.point', Demo: mouse('move'), icon: Art.Cloud, component: PointGame },
  'mouse.click': { title: 'mouse.click.title', say: 'say.mouse.click', Demo: mouse('click'), icon: Art.Balloon, component: ClickGame },
  'mouse.dbl': { title: 'mouse.dbl.title', say: 'say.mouse.dbl', Demo: mouse('dbl'), icon: Art.Gift, component: DoubleClickGame },
  'mouse.right': { title: 'mouse.right.title', say: 'say.mouse.right', Demo: mouse('right'), icon: Art.Lamp, component: RightClickGame },
  'mouse.drag': { title: 'mouse.drag.title', say: 'say.mouse.drag', Demo: mouse('drag'), icon: Art.Dog, component: DragGame },
  'mouse.scroll': { title: 'mouse.scroll.title', say: 'say.mouse.scroll.down', Demo: mouse('scroll'), icon: Art.Chest, component: ScrollGame },
  'kbd.find.lat': { title: 'kbd.find.lat.title', say: 'say.kbd.find.lat', Demo: keyDemo('A'), icon: keyIcon('A'), component: FindLat },
  'kbd.find.cyr': { title: 'kbd.find.cyr.title', say: 'say.kbd.find.cyr', Demo: keyDemo('Я'), icon: keyIcon('Я', '#FF7A6B'), component: FindCyr },
  'kbd.special': { title: 'kbd.special.title', say: 'say.kbd.special', Demo: keyDemo('Enter', true), icon: EnterIcon, component: SpecialGame },
  'kbd.word.lat': { title: 'kbd.word.lat.title', say: 'say.kbd.word.lat', Demo: keyDemo('A'), icon: wordIcon('ABC'), component: WordLat },
  'kbd.word.cyr': { title: 'kbd.word.cyr.title', say: 'say.kbd.word.cyr', Demo: keyDemo('Я'), icon: wordIcon('АБВ'), component: WordCyr },
  'parts.match': { title: 'parts.match.title', say: 'say.parts.match', Demo: mouse('drag'), icon: MatchIcon, component: PartsMatch },
  'parts.name': { title: 'parts.name.title', say: 'say.parts.name', Demo: mouse('drag'), icon: TagIcon, component: PartsName },
  'parts.use': { title: 'parts.use.title', say: 'say.parts.use', Demo: mouse('drag'), icon: UseIcon, component: PartsUse },
  // Algoritm (robot)
  'robot.arrows': { title: 'robot.arrows.title', say: 'say.robot.arrows', Demo: RobotDemo, icon: ArrowsIcon, component: ArrowsGame },
  'robot.repeat': { title: 'robot.repeat.title', say: 'say.robot.repeat', Demo: RobotDemo, icon: RepeatIcon, component: RepeatGame },
  'robot.nested': { title: 'robot.nested.title', say: 'say.robot.nested', Demo: RobotDemo, icon: NestedIcon, component: NestedGame },
  'desk.open': { title: 'desk.open.title', say: 'say.desk.open', Demo: mouse('dbl'), icon: WindowIcon, component: DeskOpen },
  'desk.file': { title: 'desk.file.title', say: 'say.desk.file', Demo: mouse('right'), icon: FileArt, component: DeskFile },
  'desk.sort': { title: 'desk.sort.title', say: 'say.desk.sort', Demo: mouse('drag'), icon: TrashArt, component: DeskSort },
  // Internet xavfsizligi
  'safety.quiz': { title: 'safety.quiz.title', say: 'say.safety.quiz', Demo: mouse('click'), icon: QuizIcon, component: ScenarioQuiz },
  'paint.free': { title: 'paint.free.title', say: 'say.paint.free', Demo: mouse('drag'), icon: PaletteIcon, component: PaintGame },
  'paint.numbers': { title: 'paint.numbers.title', say: 'say.paint.numbers', Demo: mouse('click'), icon: NumbersIcon, component: ColoringGame },
}

export const TOPICS: Record<TopicId, { title: StrKey; icon: ComponentType<{ className?: string }>; color: string }> = {
  mouse: { title: 'topic.mouse', icon: Art.MouseIcon, color: 'var(--teal)' },
  keyboard: { title: 'topic.keyboard', icon: Art.KeyboardIcon, color: 'var(--sky)' },
  parts: { title: 'topic.parts', icon: Art.MonitorIcon, color: 'var(--violet)' },
  desktop: { title: 'topic.desktop', icon: Art.FolderIcon, color: 'var(--sun)' },
  paint: { title: 'topic.paint', icon: Art.BrushIcon, color: 'var(--coral)' },
  robot: { title: 'topic.robot', icon: Art.RobotIcon, color: 'var(--leaf)' },
  safety: { title: 'topic.safety', icon: Art.ShieldIcon, color: 'var(--teal)' },
}
