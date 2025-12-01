# Add New Community Member Gift

Fill out this template for each new member. Once complete, add the entry to `app/gift-drive/data/giftRecipients.ts`.

---

## Member Information

**Name:**
<!-- First name only (e.g., "Rimy") -->

**Age:**
<!-- Optional - leave blank if not sharing -->

---

## Their Story

**Story/Background:**
<!-- 1-2 sentences explaining why this gift is meaningful to them.
     Example: "Rimy wants to honor her emotional support hero Papa who passed earlier this year. This meaningful gift will help her keep his memory close during the holiday season." -->

---

## Gift Details

**Gift Title:**
<!-- Short name (e.g., "Pet Memorial Frame") -->

**Gift Description:**
<!-- Brief description of what the gift is (e.g., "Dog memorial frame with collar holder - a beautiful way to honor and remember Papa") -->

**Gift Price:**
<!-- Dollar amount, numbers only (e.g., 29) -->

**Amazon Link:**
<!-- Full Amazon URL or shortened a.co link -->

---

## Display Options

**Ornament Color:**
<!-- Choose one: red | gold | silver | green | blue -->

---

## Code Entry

Once you have all the info, add this to `giftRecipients.ts`:

```typescript
{
  id: '[NEXT_NUMBER]',  // Increment from last entry
  name: '[NAME]',
  age: [AGE],  // Optional - remove line if not used
  story: '[STORY]',
  giftTitle: '[GIFT_TITLE]',
  giftDescription: '[GIFT_DESCRIPTION]',
  giftPrice: [PRICE],
  amazonWishlistUrl: '[AMAZON_URL]',
  ornamentColor: '[COLOR]',
  purchased: false,
  position: { top: '[TOP]%', left: '[LEFT]%' }  // Will be positioned on tree
},
```

---

## Notes

- **Position:** The `top` and `left` values place the ornament on the tree SVG. Typical ranges:
  - `top`: 20% (near top) to 75% (near bottom)
  - `left`: 35% to 65% (to stay within tree shape)

- **ID:** Use the next sequential number as a string (e.g., if last entry is '4', use '5')

- **Price:** Include only the base price - processing fees are calculated automatically
