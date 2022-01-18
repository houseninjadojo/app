import { animate, Promise } from 'liquid-fire';

export default function slideOver(dimension, direction, opts) {
  let oldParams = {},
    newParams = {},
    property,
    measure;

  if (dimension.toLowerCase() === 'x') {
    property = 'translateX';
    measure = 'width';
  } else {
    property = 'translateY';
    measure = 'height';
  }

  let bigger = biggestSize(this, measure);

  if (direction === -1) {
    this.oldElement.css('z-index', 0);
    this.newElement.css('z-index', 1);
    oldParams[property] = '0px';
    newParams[property] = ['0px', -1 * bigger * direction + 'px'];
  } else {
    oldParams[property] = bigger * direction + '0px';
    newParams[property] = ['0px', '0px'];
  }

  return Promise.all([
    animate(this.oldElement, oldParams, opts),
    animate(this.newElement, newParams, opts, 'moving-in'),
  ]);
}

function biggestSize(context, dimension) {
  let sizes = [];
  if (context.newElement) {
    sizes.push(parseInt(context.newElement.css(dimension), 10));
    sizes.push(parseInt(context.newElement.parent().css(dimension), 10));
  }
  if (context.oldElement) {
    sizes.push(parseInt(context.oldElement.css(dimension), 10));
    sizes.push(parseInt(context.oldElement.parent().css(dimension), 10));
  }
  return Math.max.apply(null, sizes);
}
