import { forwardRef } from 'react'
import { StaticImageData } from 'next/image'
import classNames from 'classnames'
import BaseImage from 'next/image'
import { Site } from '@/config/site'
import plugImg from '@/assets/images/plug.png'
import styles from './Image.module.scss'

interface Props {
  className?: string
  alt?: string
  src: StaticImageData | string
  width?: number
  height?: number
}

const Image = forwardRef<HTMLImageElement, Props>(
  ({ className, alt = Site.name, src, width, height }, ref) => (
    <BaseImage
      className={classNames(className, styles.image)}
      ref={ref}
      alt={alt}
      src={src}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={plugImg.blurDataURL}
    />
  )
)

Image.displayName = 'Image'

export default Image
