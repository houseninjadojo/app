import { stop, animate, Promise, isAnimating, finish } from 'liquid-fire';

export default function slideOver(dimension, direction, opts) {
  let oldParams = {},
    newParams = {},
    property,
    measure,
    firstStep;

  const context = this;

  if (dimension.toLowerCase() === 'x') {
    property = 'translateX';
    measure = 'width';
  } else {
    property = 'translateY';
    measure = 'height';
  }

  disableButtons(context, true);

  if (isAnimating(this.oldElement, 'moving-in')) {
    firstStep = finish(this.oldElement, 'moving-in');
  } else {
    stop(this.oldElement);
    firstStep = Promise.resolve();
  }

  return firstStep.then(() => {
    let bigger = biggestSize(context, measure);

    if (direction === -1) {
      this.oldElement.css('z-index', 0);
      this.newElement.css('z-index', 1);
      oldParams[property] = '0px';
      oldParams['scale'] = '0.95';
      newParams[property] = ['0px', -1 * bigger * direction + 'px'];
    } else {
      oldParams[property] = bigger * direction + '0px';
      newParams[property] = ['0px', '0px'];
    }

    return Promise.all([
      animate(this.oldElement, oldParams, opts),
      animate(this.newElement, newParams, opts, 'moving-in'),
    ]).then(() => {
      new Promise((resolve) => {
        resolve(disableButtons(context, false));
      });
    });
  });
}

function disableButtons(context, disable) {
  const oldButtons = new Array(context.oldElement.find('button'));
  const newButtons = new Array(context.newElement.find('button'));
  const allButtons = [...oldButtons, ...newButtons];

  allButtons.forEach((element) => {
    element.prop('disabled', disable);
  });
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
