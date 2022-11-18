import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateRoleDto } from "./dto/createRole.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Role } from "./roles.model";
import { RolesService } from "./roles.service";

@ApiTags("Roles")
@Controller("roles")
export class RolesController {
  constructor(
    private roleService: RolesService
  ) {
  }

  @ApiOperation({ summary: "Role creation" })
  @ApiResponse({ status: 200, type: Role })
  @Post()
  createRole(@Body() roleDto: CreateRoleDto) {
    return this.roleService.createRole(roleDto);
  }

  @ApiOperation({ summary: "Get all roles" })
  @ApiResponse({ status: 200, type: [Role] })
  @Get(`/:name`)
  getAllRoles(@Param("name") name: string) {
    return this.roleService.getRoleByName(name);
  }
}
