import { Edit } from "app/auth/validations"
import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.zod(Edit), resolver.authorize(), async ({ name }, ctx) => {
  const user = await db.user.update({
    data: { name },
    where: { id: ctx.session.userId },
  })

  return user
})
